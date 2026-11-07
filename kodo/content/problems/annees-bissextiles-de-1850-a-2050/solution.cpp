#include <iostream>
using namespace std;

int main() {
    // 1900 n'est pas bissextile (divisible par 100 mais pas par 400) :
    // on coupe la suite de 4 en 4 en deux boucles.
    for (int annee = 1852; annee <= 1896; annee += 4) {
        cout << annee << "\n";
    }
    // 2000 est divisible par 400 : la règle habituelle s'applique.
    for (int annee = 1904; annee <= 2048; annee += 4) {
        cout << annee << "\n";
    }
    return 0;
}
