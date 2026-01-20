
/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description configuration of Swagger UI
 * 
 */
import { SwaggerUiOptions } from "swagger-ui-express";

// CORRECT: Include the full path and a specific version
const SWAGGER_URL = "https://cdnjs.cloudflare.com";

const swaggerOptions: SwaggerUiOptions = {
  // Correctly resolves to: https://cdnjs.cloudflare.com/swagger-ui.min.css
  customCssUrl: `${SWAGGER_URL}/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css`,
  customJs: [
    `${SWAGGER_URL}/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js`,
    `${SWAGGER_URL}/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js`
  ],
  swaggerOptions: {
    // Required to tell the UI where your generated JSON lives
    // url: "/swagger.json",   
    deepLinking: true,
  },
  customSiteTitle: "My API Docs",
};

export { swaggerOptions };
