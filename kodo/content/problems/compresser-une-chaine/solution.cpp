#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int n = s.size();

    string resultat = "";
    int i = 0;
    while (i < n) {
        // Le groupe commence en i : on avance j tant que la lettre est la même.
        int j = i;
        while (j < n && s[j] == s[i]) {
            j++;
        }
        int taille = j - i;
        resultat += s[i];
        if (taille >= 2) {
            resultat += to_string(taille);
        }
        // Le groupe suivant commence en j.
        i = j;
    }

    cout << resultat << "\n";
    return 0;
}
