export const toPeso = (num) => new Intl.NumberFormat("en-US", {style:"currency", currency:"php"}).format(num)
