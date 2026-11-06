// Traduit les erreurs les plus fréquentes des débutants en une phrase claire (français ou anglais).
// Le message d'origine reste affiché en dessous : on apprend aussi à lire une vraie erreur.

import type { Lang } from './protocol'

type Text = [fr: string, en: string]
type Rule = [RegExp, (m: RegExpMatchArray) => Text]

const PYTHON: Rule[] = [
  [/IndentationError/, () => [
    'Problème d’indentation : les lignes d’un même bloc (après if, for, while, def…) doivent commencer par le même nombre d’espaces.',
    'Indentation problem: the lines of a block (after if, for, while, def…) must all start with the same number of spaces.',
  ]],
  [/SyntaxError: expected ':'/, () => [
    'Il manque les deux-points « : » à la fin de la ligne (après if, else, for, while ou def).',
    'A colon “:” is missing at the end of the line (after if, else, for, while or def).',
  ]],
  [/SyntaxError: (?:'\(' was never closed|'\[' was never closed|unexpected EOF|unterminated)/, () => [
    'Une parenthèse, un crochet ou des guillemets ne sont pas refermés.',
    'A parenthesis, a bracket or a quote is never closed.',
  ]],
  [/Maybe you meant '==' or ':=' instead of '='/, () => [
    'Pour comparer deux valeurs, on écrit « == » ; un seul « = » sert à ranger une valeur dans une variable.',
    'To compare two values, write “==”; a single “=” stores a value in a variable.',
  ]],
  [/Perhaps you forgot a comma/, () => ['Il manque sans doute une virgule.', 'A comma is probably missing.']],
  [/SyntaxError/, () => [
    'Erreur de syntaxe : Python ne comprend pas une ligne. Vérifie les parenthèses, les deux-points et les guillemets autour de la ligne indiquée.',
    'Syntax error: Python cannot read a line. Check the parentheses, colons and quotes around the line shown.',
  ]],
  [/NameError: name '(\w+)' is not defined/, (m) => [
    `Le nom « ${m[1]} » n’existe pas à cet endroit : faute de frappe, variable utilisée avant d’être définie, ou guillemets oubliés autour d’un texte ?`,
    `The name “${m[1]}” does not exist here: a typo, a variable used before it is defined, or missing quotes around a text?`,
  ]],
  [/ValueError: invalid literal for int\(\) with base 10: '(.*)'/, (m) =>
    m[1].trim().includes(' ')
      ? [`int() a reçu « ${m[1]} », qui contient plusieurs nombres : découpe d’abord la ligne avec split().`, `int() received “${m[1]}”, which contains several numbers: split the line first with split().`]
      : [`int() a reçu « ${m[1]} », qui n’est pas un nombre entier.`, `int() received “${m[1]}”, which is not a whole number.`]],
  [/ValueError: not enough values to unpack \(expected (\d+), got (\d+)\)/, (m) => [
    `Tu attends ${m[1]} valeurs mais la ligne n’en contient que ${m[2]}. Relis le format de l’entrée.`,
    `You expect ${m[1]} values but the line only has ${m[2]}. Re-read the input format.`,
  ]],
  [/ValueError: too many values to unpack \(expected (\d+)\)/, (m) => [
    `La ligne contient plus de ${m[1]} valeurs : relis le format de l’entrée.`,
    `The line contains more than ${m[1]} values: re-read the input format.`,
  ]],
  [/EOFError/, () => [
    'Ton programme essaie de lire plus de lignes qu’il n’y en a dans l’entrée. Compte bien les input() par rapport au format de l’entrée.',
    'Your program tries to read more lines than the input has. Count your input() calls against the input format.',
  ]],
  [/IndexError: (list|string) index out of range/, (m) => [
    `Tu lis une case qui n’existe pas dans ${m[1] === 'list' ? 'la liste' : 'la chaîne'} : les indices vont de 0 à len(…) − 1.`,
    `You read a position that does not exist in the ${m[1]}: indices go from 0 to len(…) − 1.`,
  ]],
  [/KeyError: (.*)/, (m) => [
    `La clé ${m[1]} n’est pas dans le dictionnaire. Vérifie avec « if cle in dico » avant de la lire, ou utilise dico.get(cle, 0).`,
    `The key ${m[1]} is not in the dictionary. Check with “if key in d” before reading it, or use d.get(key, 0).`,
  ]],
  [/ZeroDivisionError/, () => ['Division par zéro : vérifie que le diviseur ne peut pas valoir 0.', 'Division by zero: make sure the divisor can never be 0.']],
  [/can only concatenate str \(not "\w+"\) to str|unsupported operand type\(s\) for [^:]+: '(?:str|int)' and '(?:str|int)'/, () => [
    'Tu mélanges du texte et un nombre dans un calcul. input() renvoie toujours du texte : convertis-le avec int().',
    'You are mixing text and a number in a calculation. input() always returns text: convert it with int().',
  ]],
  [/TypeError: '(\w+)' object is not callable/, (m) => [
    `Tu utilises un objet de type ${m[1]} comme une fonction : parenthèses en trop, ou une variable porte le même nom qu’une fonction (list, sum, max…) ?`,
    `You are calling a ${m[1]} as if it were a function: extra parentheses, or a variable named like a function (list, sum, max…)?`,
  ]],
  [/TypeError: '(\w+)' object is not subscriptable/, (m) => [
    `Tu utilises des crochets sur un objet de type ${m[1]}, qui n’a pas de cases.`,
    `You are using square brackets on a ${m[1]}, which has no positions.`,
  ]],
  [/RecursionError|Maximum call stack size exceeded/, () => [
    'Trop d’appels récursifs imbriqués. Vérifie le cas de base de ta fonction, ou passe à une version avec une boucle.',
    'Too many nested recursive calls. Check your base case, or switch to a loop.',
  ]],
  [/MemoryError/, () => ['Ton programme utilise trop de mémoire.', 'Your program uses too much memory.']],
]

const CPP: Rule[] = [
  [/error: expected ';'/, () => [
    'Il manque un point-virgule « ; » à la fin d’une instruction (regarde la ligne indiquée ou celle juste au-dessus).',
    'A semicolon “;” is missing at the end of a statement (look at the line shown or the one just above).',
  ]],
  [/error: use of undeclared identifier '(\w+)'/, (m) =>
    ['cin', 'cout', 'endl', 'vector', 'string', 'sort', 'max', 'min'].includes(m[1])
      ? [`« ${m[1]} » est inconnu : ajoute « using namespace std; » ou écris std::${m[1]}, et vérifie les #include.`, `“${m[1]}” is unknown: add “using namespace std;” or write std::${m[1]}, and check your #include lines.`]
      : [`« ${m[1]} » n’est pas déclaré : faute de frappe, ou variable déclarée dans un autre bloc ?`, `“${m[1]}” is not declared: a typo, or a variable declared in another block?`]],
  [/cannot use '(throw|try)' with exceptions disabled/, () => [
    'Les exceptions (try/throw) ne sont pas disponibles sur Cordée. Gère les cas particuliers avec des if.',
    'Exceptions (try/throw) are not available on Cordée. Handle special cases with if statements.',
  ]],
  [/error: expected '\}'|extraneous closing brace/, () => ['Les accolades { } ne sont pas équilibrées.', 'The braces { } are not balanced.']],
  [/error: no matching function for call to '(\w+)'/, (m) => [
    `Appel à « ${m[1]} » avec des arguments du mauvais type ou en mauvais nombre.`,
    `“${m[1]}” is called with arguments of the wrong type or number.`,
  ]],
  [/fatal error: '([^']+)' file not found/, (m) => [`L’en-tête <${m[1]}> n’existe pas. Vérifie son nom.`, `The header <${m[1]}> does not exist. Check its name.`]],
  [/RuntimeError: unreachable/, () => [
    'Le programme s’est arrêté brutalement (abort) : accès hors d’un vector avec .at(), assert raté, ou erreur de la bibliothèque standard.',
    'The program aborted: out-of-range .at() on a vector, a failed assert, or a standard library error.',
  ]],
  [/memory access out of bounds/, () => [
    'Accès mémoire hors limites : tu lis ou écris en dehors d’un tableau (indice négatif ou trop grand).',
    'Out-of-bounds memory access: you read or write outside an array (negative or too large index).',
  ]],
  [/divide by zero/i, () => ['Division (ou modulo) par zéro.', 'Division (or modulo) by zero.']],
  [/Maximum call stack size exceeded|call stack exhausted/, () => ['La pile d’appels a débordé : récursion trop profonde ou infinie.', 'Stack overflow: recursion too deep or infinite.']],
]

export function explainError(lang: Lang, text: string, ui: 'fr' | 'en' = 'fr'): string | null {
  if (!text) return null
  for (const [re, fn] of lang === 'python' ? PYTHON : CPP) {
    const m = text.match(re)
    if (m) return fn(m)[ui === 'en' ? 1 : 0]
  }
  return null
}

/** Ne garde que les premières lignes de la sortie du compilateur, sans les chemins internes. */
export function trimCompilerOutput(text: string, maxLines = 30) {
  const lines = text.replace(/\/tmp\/[\w.-]+\//g, '').split('\n')
  return lines.length > maxLines ? [...lines.slice(0, maxLines), `… (+${lines.length - maxLines})`].join('\n') : text
}
