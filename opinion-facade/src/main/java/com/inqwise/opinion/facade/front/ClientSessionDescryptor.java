package com.inqwise.opinion.facade.front;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.inqwise.opinion.http.HttpClientSession;
import com.inqwise.opinion.http.HttpClientSessionUserArgs;
import com.inqwise.opinion.infrastructure.systemFramework.ApplicationLog;
import com.inqwise.opinion.infrastructure.systemFramework.NetworkHelper;
import com.inqwise.opinion.infrastructure.systemFramework.cryptography.StringEncrypter;
import com.inqwise.opinion.library.common.errorHandle.ErrorCode;
import com.inqwise.opinion.library.systemFramework.ApplicationConfiguration;

public class ClientSessionDescryptor {
	static ApplicationLog logger = ApplicationLog
			.getLogger(ClientSessionDescryptor.class);
	
	private static final String SESSION_ID_COOKIE_KEY = "sid";
	private static final String UNIQUE_ID_COOKIE_KEY = "uid";
	protected static final String passPhrase = "3b4b9507";
	
	public static String getClientIp(HttpServletRequest request){
		String remoteAddr = request.getRemoteAddr();
		String xForwardedForHeader = request.getHeader(NetworkHelper.X_FORWARDED_FOR_HEADER_NAME);
		remoteAddr = NetworkHelper.identifyClientIp(remoteAddr, xForwardedForHeader);
		return remoteAddr;    
	}
	
	public static HttpClientSession getSession(HttpServletRequest request) {
		String sessionId = null;
		String encryptedUserArgs = null;
		String clientIp = getClientIp(request);
		
		/*
		 * Cookies
		 */
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if(cookie.getMaxAge() != 0){
					String cookieName = cookie.getName();
					if (cookieName.equals(SESSION_ID_COOKIE_KEY)) {
						sessionId = cookie.getValue();
					} else if (cookieName.equals(UNIQUE_ID_COOKIE_KEY)) {
						encryptedUserArgs = cookie.getValue();
					} 
				}
			}
		}
		
		try {
			
			/*
			 * Decryption
			 */
			StringEncrypter desEncrypter = new StringEncrypter(passPhrase);
			
			if(null == encryptedUserArgs){ 
				return new HttpClientSession(ErrorCode.NotSignedIn, "Not signed in");
			} else {
				String decryptedUserArgsStr = (null == encryptedUserArgs) ? null : desEncrypter.decrypt(encryptedUserArgs.replaceAll(" ", "+"));
				if(null == decryptedUserArgsStr) {
					return new HttpClientSession(ErrorCode.NotSignedIn, "Not signed in");
				} else {
					// Deserialize
					var userArgs = new HttpClientSessionUserArgs(new JSONObject(decryptedUserArgsStr));
					
					return new HttpClientSession( sessionId, userArgs.getUserId(),
							clientIp, userArgs.getProductId(), userArgs.getClientIp());
				}
			}
		} catch (Exception t) {
			UUID errorId = logger.error(t, "getSession() : Unexpected error occured.");
			return new HttpClientSession(errorId, t.toString());
		}
	}

	private static void addToSession(String key, String value, Boolean encripted,
			boolean isPersist, HttpServletResponse response) {
		int cookieExpire = isPersist ? (60 * 60 * 24) * 30 /* 30 days */ : -1;
		if(encripted){
			StringEncrypter desEncrypter = new StringEncrypter(passPhrase);
			value = desEncrypter.encrypt(value);
		}
		
		Cookie uniqueCookie = new Cookie(key, value);
		uniqueCookie.setMaxAge(cookieExpire);
		uniqueCookie.setPath("/");
		if(null != ApplicationConfiguration.Opinion.getSessionDomain()){
			uniqueCookie.setDomain(ApplicationConfiguration.Opinion.getSessionDomain());
		}
		response.addCookie(uniqueCookie);
	}
	
	public static void addUserIdToSession(Long userId, int productId, String clientIp, boolean untilEndSession, HttpServletResponse response) throws IOException{
		var userArgs = HttpClientSessionUserArgs
				.builder()
				.withClientIp(clientIp)
				.withProductId(productId)
				.withUserId(userId)
				.build();
		
		 // Serialize
        
		addToSession(UNIQUE_ID_COOKIE_KEY, userArgs.toJson().toString(), true, untilEndSession, response);
	}
	
	public static void addSessionIdToSession(UUID sessionId, boolean isPersist, HttpServletResponse response){
		addToSession(SESSION_ID_COOKIE_KEY, sessionId.toString(), false, isPersist, response);
	}
	
}
