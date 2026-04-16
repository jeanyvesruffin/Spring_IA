# Spring_IA

[https://docs.spring.io/spring-ai/reference/](https://docs.spring.io/spring-ai/reference/)

## Ajout de credential github pour l'utilisation de LLM

### Générer un Token GitHub

Allez dans vos paramètres GitHub : Settings > Developer settings > Personal access tokens > Fine-grained tokens.

Créez un token avec les permissions nécessaires avec `Models` selectionné dans la section `+ Add permissions`.

### Creation des credentials du modele LLM 

Dans le fichier [shared.properties](config/src/main/resources/config/shared.properties) ajouter cette configuration apres avoir choisie le modeles LLM que vous desirez utiliser.

Exemple :

```bash
spring.ai.openai.base-url=https://models.inference.ai.azure.com
spring.ai.openai.chat.completions-path=/chat/completions
spring.ai.openai.api-key=[YOUR-API]
spring.ai.openai.chat.options.model=gpt-5-mini
```

Pour récupérerr des crédentials depuis github : [https://github.com/marketplace/models](https://github.com/marketplace/models)



### Dependences à utiliser suivant LLM choisie
Le `ChatClient` nécessite un `ChatModel` sous-jacent — Spring AI propose des starters pour chaque fournisseur.

| Fournisseur       | Artifact                                  |
|-------------------|-------------------------------------------|
| **OpenAI**        | `spring-ai-starter-model-openai`          |
| **Anthropic**     | `spring-ai-starter-model-anthropic`       |
| **Ollama** (local)| `spring-ai-starter-model-ollama`          |
| **Azure OpenAI**  | `spring-ai-starter-model-azure-openai`    |
| **Mistral AI**    | `spring-ai-starter-model-mistral-ai`      |

Exemple avec OpenAI :
```xml
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-starter-model-openai</artifactId>
</dependency>
```
---


## Chat IA
[https://docs.spring.io/spring-ai/reference/api/chatclient.html](https://docs.spring.io/spring-ai/reference/api/chatclient.html)

### Dependances

Le `ChatClient` repose sur les deux stacks — le mode non-streaming utilise la stack Servlet, et le streaming utilise la stack Reactive. Il faut donc inclure les deux si vous utilisez le streaming.

```xml
<!-- Pour les appels synchrones (non-streaming) -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Pour le streaming (Flux<String>) -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```
---

### Demarrage

Au demarrage. 

```sh
mvn clean install
cd chatAutoconfiguration
mvn clean install
mvn spring-boot:run
```

Puis vous trouverez dans les logs de votre terminal la response à: 

```log
Chat Autoconfiguration Application is running...
2 + 3 = 5.
```

Sinon vous pouvez questionner votre IA à l'aide d'un navigateur, exemple :


[http://localhost:8086/api?userInput=Donne moi la recette du colombo](http://localhost:8086/api?userInput=Donne%20moi%20la%20recette%20du%20colombo)

---