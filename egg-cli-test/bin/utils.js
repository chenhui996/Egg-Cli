import pathExists from 'path-exists'

export const exists = (p) => {
  return pathExists.sync(p)
}
