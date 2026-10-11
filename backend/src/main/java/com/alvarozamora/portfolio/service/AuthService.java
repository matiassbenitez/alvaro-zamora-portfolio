package com.alvarozamora.portfolio.service;

import com.alvarozamora.portfolio.dto.AuthDtos;
import com.alvarozamora.portfolio.entity.AdminUser;
import com.alvarozamora.portfolio.exception.ApiException;
import com.alvarozamora.portfolio.repository.AdminUserRepository;
import com.alvarozamora.portfolio.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        }
        String token = jwtService.generateToken(user.getUsername(), "ADMIN");
        return new AuthDtos.LoginResponse(token, user.getUsername());
    }
}
