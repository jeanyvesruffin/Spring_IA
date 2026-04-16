package ruffinjy.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ruffinjy.services.ChatService;

@RestController
public class chatController {

    private final ChatService chatService;

    public chatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/api")
    public String useAi(@RequestParam(required = true) String userInput) {
        return chatService.generateResponse(userInput);
    }

}
