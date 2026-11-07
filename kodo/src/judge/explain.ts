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
    'Deux-points « : » manquants en fin de ligne (après if, else, for, while ou def).',
    'Missing colon “:” at the end of the line (after if, else, for, while or def).',
  ]],
  [/SyntaxError: (?:'\(' was never closed|'\[' was never closed|unexpected EOF|unterminated)/, () => [
    'Une parenthèse, un crochet ou des guillemets ne sont pas refermés.',
    'A parenthesis, a bracket or a quote is never closed.',
  ]],
  [/Maybe you meant '==' or ':=' instead of '='/, () => [
    'Comparaison de deux valeurs : « == ». Un seul « = » range une valeur dans une variable.',
    'Comparing two values: “==”. A single “=” stores a value in a variable.',
  ]],
  [/Perhaps you forgot a comma/, () => ['Virgule probablement manquante.', 'Probably a missing comma.']],
  [/SyntaxError/, () => [
    'Erreur de syntaxe : Python ne peut pas lire une ligne. Vérifier les parenthèses, les deux-points et les guillemets autour de la ligne indiquée.',
    'Syntax error: Python cannot read a line. Check the parentheses, colons and quotes around the line shown.',
  ]],
  [/NameError: name '(\w+)' is not defined/, (m) => [
    `Le nom « ${m[1]} » n’existe pas à cet endroit : faute de frappe, variable utilisée avant d’être définie, ou guillemets oubliés autour d’un texte ?`,
    `The name “${m[1]}” does not exist here: a typo, a variable used before it is defined, or missing quotes around a text?`,
  ]],
  [/ValueError: invalid literal for int\(\) with base 10: '(.*)'/, (m) =>
    m[1].trim().includes(' ')
      ? [`int() a reçu « ${m[1]} », qui contient plusieurs nombres : découper d’abord la ligne avec split().`, `int() received “${m[1]}”, which contains several numbers: split the line first with split().`]
      : [`int() a reçu « ${m[1]} », qui n’est pas un nombre entier.`, `int() received “${m[1]}”, which is not a whole number.`]],
  [/ValueError: not enough values to unpack \(expected (\d+), got (\d+)\)/, (m) => [
    `${m[1]} valeurs attendues, mais la ligne n’en contient que ${m[2]}. Relire le format de l’entrée.`,
    `${m[1]} values expected, but the line only has ${m[2]}. Re-read the input format.`,
  ]],
  [/ValueError: too many values to unpack \(expected (\d+)\)/, (m) => [
    `La ligne contient plus de ${m[1]} valeurs : relire le format de l’entrée.`,
    `The line contains more than ${m[1]} values: re-read the input format.`,
  ]],
  [/EOFError/, () => [
    'Le programme lit plus de lignes que l’entrée n’en contient. Compter les appels à input() par rapport au format de l’entrée.',
    'The program reads more lines than the input contains. Count the input() calls against the input format.',
  ]],
  [/IndexError: (list|string) index out of range/, (m) => [
    `Lecture d’une case qui n’existe pas dans ${m[1] === 'list' ? 'la liste' : 'la chaîne'} : les indices vont de 0 à len(…) − 1.`,
    `Reading a position that does not exist in the ${m[1]}: indices go from 0 to len(…) − 1.`,
  ]],
  [/KeyError: (.*)/, (m) => [
    `La clé ${m[1]} n’est pas dans le dictionnaire. Vérifier avec « if cle in dico » avant de la lire, ou utiliser dico.get(cle, 0).`,
    `The key ${m[1]} is not in the dictionary. Check with “if key in d” before reading it, or use d.get(key, 0).`,
  ]],
  [/ZeroDivisionError/, () => ['Division par zéro : vérifier que le diviseur ne peut pas valoir 0.', 'Division by zero: check that the divisor can never be 0.']],
  [/can only concatenate str \(not "\w+"\) to str|unsupported operand type\(s\) for [^:]+: '(?:str|int)' and '(?:str|int)'/, () => [
    'Texte et nombre mélangés dans un calcul. input() renvoie toujours du texte : le convertir avec int().',
    'Text and a number mixed in a calculation. input() always returns text: convert it with int().',
  ]],
  [/TypeError: '(\w+)' object is not callable/, (m) => [
    `Objet de type ${m[1]} appelé comme une fonction : parenthèses en trop, ou variable qui porte le nom d’une fonction (list, sum, max…) ?`,
    `A ${m[1]} called as if it were a function: extra parentheses, or a variable named like a function (list, sum, max…)?`,
  ]],
  [/TypeError: '(\w+)' object is not subscriptable/, (m) => [
    `Crochets utilisés sur un objet de type ${m[1]}, qui n’a pas de cases.`,
    `Square brackets used on a ${m[1]}, which has no positions.`,
  ]],
  [/RecursionError|Maximum call stack size exceeded/, () => [
    'Trop d’appels récursifs imbriqués. Vérifier le cas de base de la fonction, ou passer à une version avec une boucle.',
    'Too many nested recursive calls. Check the function’s base case, or switch to a loop.',
  ]],
  [/MemoryError/, () => ['Mémoire dépassée : le programme utilise trop de mémoire.', 'Memory exceeded: the program uses too much memory.']],
]

const CPP: Rule[] = [
  [/error: expected ';'/, () => [
    'Point-virgule « ; » manquant à la fin d’une instruction (ligne indiquée ou celle juste au-dessus).',
    'Missing semicolon “;” at the end of a statement (line shown or the one just above).',
  ]],
  [/error: use of undeclared identifier '(\w+)'/, (m) =>
    ['cin', 'cout', 'endl', 'vector', 'string', 'sort', 'max', 'min'].includes(m[1])
      ? [`« ${m[1]} » est inconnu : ajouter « using namespace std; » ou écrire std::${m[1]}, et vérifier les #include.`, `“${m[1]}” is unknown: add “using namespace std;” or write std::${m[1]}, and check the #include lines.`]
      : [`« ${m[1]} » n’est pas déclaré : faute de frappe, ou variable déclarée dans un autre bloc ?`, `“${m[1]}” is not declared: a typo, or a variable declared in another block?`]],
  [/cannot use '(throw|try)' with exceptions disabled/, () => [
    'Les exceptions (try/throw) ne sont pas disponibles sur Kodo. Gérer les cas particuliers avec des if.',
    'Exceptions (try/throw) are not available on Kodo. Handle special cases with if statements.',
  ]],
  [/error: expected '\}'|extraneous closing brace/, () => ['Les accolades { } ne sont pas équilibrées.', 'The braces { } are not balanced.']],
  [/error: no matching function for call to '(\w+)'/, (m) => [
    `Appel à « ${m[1]} » avec des arguments du mauvais type ou en mauvais nombre.`,
    `“${m[1]}” is called with arguments of the wrong type or number.`,
  ]],
  [/fatal error: '([^']+)' file not found/, (m) => [`L’en-tête <${m[1]}> n’existe pas. Vérifier son nom.`, `The header <${m[1]}> does not exist. Check its name.`]],
  [/RuntimeError: unreachable/, () => [
    'Le programme s’est arrêté brutalement (abort) : accès hors d’un vector avec .at(), assert raté, ou erreur de la bibliothèque standard.',
    'The program aborted: out-of-range .at() on a vector, a failed assert, or a standard library error.',
  ]],
  [/memory access out of bounds/, () => [
    'Accès mémoire hors limites : lecture ou écriture en dehors d’un tableau (indice négatif ou trop grand).',
    'Out-of-bounds memory access: a read or write outside an array (negative or too large index).',
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
