package com.icareer.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService{
	
	private final String secretKey;
	
	Map<String,Object> claims = new HashMap<>();
	
	public JwtService(@Value("${jwt.secret.key}") String secretKey) {
		super();
		this.secretKey = secretKey;
	}

	public String generateToken(String email){
		
		  // You can add custom claims here
//        claims.put("role", user.getRole());
//        claims.put("id", user.getId());   
        
		return Jwts
				.builder()
				.setClaims(claims)
//				.subject(user.getUserName())
				.setSubject(email)
				.setIssuer("icareer")
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 60*10*1000))
				.signWith(generateKey(), SignatureAlgorithm.HS256)
				.compact();
	}
	
	private SecretKey generateKey(){
//		byte[] decode = Decoders.BASE64.decode(getSecretKey());
		byte[] decode = Decoders.BASE64.decode(getSecretKey());
		return Keys.hmacShaKeyFor(decode);
//		return Keys.hmacShaKeyFor(getSecretKey().getBytes());
	}
	
	public String getSecretKey(){		
//		return secretKey = "e00b4814f7950871eeca508e4eb8cab7a06176018830c4f368cd33f4741eb2a9";
//		String strongKey = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded().toString();
//
//		return strongKey;
		return secretKey;
	}
	
	public String extractUserName(String token) {
		return extractClaims(token,Claims::getSubject);
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails){
		final String userName = extractUserName(token);
	
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	private boolean isTokenExpired(String token){
		return extractExpiration(token).before(new Date());
	}
	
	private <T> T extractClaims(String token, Function<Claims,T> claimResolver){
		Claims claims = extractClaims(token);
		return claimResolver.apply(claims);
	}
	
	private Date extractExpiration(String token){
		return extractClaims(token, Claims::getExpiration);
	}
	
	private Claims extractClaims(String token){
		return Jwts
				.parserBuilder()
				.setSigningKey(generateKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
}