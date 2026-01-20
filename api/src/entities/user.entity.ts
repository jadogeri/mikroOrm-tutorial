/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User entity
 * 
 */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'text' }) // Use text for potentially longer descriptions
  email!: string;
}
