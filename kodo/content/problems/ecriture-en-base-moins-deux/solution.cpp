#include <iostream>
#include <string>
using namespace std;

int main() {
    int t;
    cin >> t;
    for (int q = 0; q < t; q++) {
        long long n;
        cin >> n;
        if (n == 0) {
            cout << "0\n";
            continue;
        }
        string chiffres = "";
        // invariant : N = (valeur des chiffres rangés) + (-2)^taille × n
        while (n != 0) {
            int r = (n % 2 != 0) ? 1 : 0;   // n % 2 vaut -1 si n est impair et négatif
            chiffres += (char) ('0' + r);
            n = (n - r) / (-2);             // division exacte
        }
        string ecriture = "";
        for (int i = (int) chiffres.size() - 1; i >= 0; i--) {
            ecriture += chiffres[i];
        }
        cout << ecriture << "\n";
    }
    return 0;
}
