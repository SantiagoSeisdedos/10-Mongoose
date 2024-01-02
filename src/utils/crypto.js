import { hashSync, compareSync, genSaltSync } from 'bcrypt'

export function hashPassword(phrase) {
  return hashSync(phrase, genSaltSync(10))
}

export function areHashesEqual(received, stored) {
    return compareSync(received, stored)
}