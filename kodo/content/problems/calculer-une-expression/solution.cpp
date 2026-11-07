#include <iostream>
#include <string>
using namespace std;

int main() {
    string expr;
    cin >> expr;
    int n = expr.size();

    int total = 0;   // somme des termes déjà terminés
    int signe = 1;   // signe du terme en cours : 1 ou -1
    int terme = 0;   // valeur du terme en cours (un produit)
    char op = '+';   // l'opération placée juste avant le nombre que l'on va lire

    int i = 0;
    while (i < n) {
        // On lit le nombre qui commence en i, chiffre par chiffre.
        int nombre = 0;
        while (i < n && expr[i] >= '0' && expr[i] <= '9') {
            nombre = nombre * 10 + (expr[i] - '0');
            i++;
        }

        if (op == '*') {
            // Le produit continue : le terme en cours est multiplié.
            terme = terme * nombre;
        } else {
            // Un + ou un - termine le terme précédent et en commence un nouveau.
            total = total + signe * terme;
            if (op == '+') {
                signe = 1;
            } else {
                signe = -1;
            }
            terme = nombre;
        }

        // On lit l'opération suivante, s'il en reste une.
        if (i < n) {
            op = expr[i];
            i++;
        }
    }

    // Le dernier terme n'est suivi d'aucun + ou - : on l'ajoute à la fin.
    total = total + signe * terme;
    cout << total << "\n";
    return 0;
}
