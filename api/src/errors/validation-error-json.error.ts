/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Validation error class for handling HTTP 400 Bad Request errors
 * 
 */

interface ValidateUserErrorJSON  {
  message: "Validation failed";
  details: string[];
}