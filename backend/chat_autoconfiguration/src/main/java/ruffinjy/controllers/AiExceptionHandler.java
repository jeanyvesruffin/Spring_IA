package ruffinjy.controllers;

import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
public class AiExceptionHandler {
    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<String> handleAiRateLimit(NonTransientAiException ex) {
        // Extraire le modèle IA et le temps d'attente depuis le message JSON
        String message = ex.getMessage();
        String model = extractModelName(message);
        String wait = extractWaitTime(message);
        String details = extractDetails(message);
        String response = "Limite d'utilisation atteinte pour le modèle IA : " + model + ". " +
                "Veuillez patienter " + wait + " secondes avant de réessayer.\n" +
                (details != null ? details : "");
        return ResponseEntity.status(429).body(response);
    }

    private String extractModelName(String message) {
        // Recherche du modèle dans le message d'erreur (ex: "model":"gpt-5-mini")
        Pattern p = Pattern.compile("model\\s*[:=]\\s*['\"]?([\u0020-\u007E]+?)['\"]?(,|})", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(message);
        if (m.find()) return m.group(1);
        // Sinon, essayer de trouver dans le message complet
        if (message.contains("mistral")) return "mistral";
        if (message.contains("gpt")) return "gpt";
        return "inconnu";
    }

    private String extractWaitTime(String message) {
        Pattern p = Pattern.compile("wait (\\d+) seconds", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(message);
        if (m.find()) return m.group(1);
        return "?";
    }

    private String extractDetails(String message) {
        Pattern p = Pattern.compile("\\\"details\\\":\\\"([^\\\"]+)\\\"", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(message);
        if (m.find()) return m.group(1);
        return null;
    }
}
