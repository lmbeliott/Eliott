#include <iostream>
using namespace std;

int main() {
    int s;
    cin >> s;
    int q = s / 9;             // nombre de chiffres 9
    int r = s % 9;             // le premier chiffre (absent s'il vaut 0)
    long long resultat = r;
    for (int i = 0; i < q; i++) {
        resultat = resultat * 10 + 9;   // on ajoute un 9 à droite
    }
    cout << resultat << "\n";
    return 0;
}
