#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<int> valeurs = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    vector<string> symboles = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};

    // valeur de chaque lettre, rangée à l'indice lettre - 'A'
    vector<int> valeur_lettre(26, 0);
    string lettres = "IVXLCDM";
    vector<int> montants = {1, 5, 10, 50, 100, 500, 1000};
    for (int i = 0; i < 7; i++) {
        valeur_lettre[lettres[i] - 'A'] = montants[i];
    }

    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string s;
        cin >> s;
        if (s[0] >= '0' && s[0] <= '9') {
            // chiffres -> romains : on retire les plus grandes valeurs possibles
            int n = stoi(s);
            string res = "";
            for (int i = 0; i < 13; i++) {
                while (n >= valeurs[i]) {
                    res += symboles[i];
                    n = n - valeurs[i];
                }
            }
            cout << res << "\n";
        } else {
            // romains -> chiffres : un symbole suivi d'un plus grand est soustrait
            int total = 0;
            int len = s.size();
            for (int i = 0; i < len; i++) {
                int v = valeur_lettre[s[i] - 'A'];
                if (i + 1 < len && v < valeur_lettre[s[i + 1] - 'A']) {
                    total = total - v;
                } else {
                    total = total + v;
                }
            }
            cout << total << "\n";
        }
    }
    return 0;
}
