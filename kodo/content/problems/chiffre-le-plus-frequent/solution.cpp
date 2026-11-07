#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    if (n == 0) {
        cout << 0 << " " << 1 << "\n";    // 0 s'écrit avec un seul chiffre 0
    } else {
        int meilleur = 0;
        int meilleur_compte = 0;
        for (int c = 0; c <= 9; c++) {      // un passage pour chaque chiffre c
            long long m = n;                // copie : la boucle interne la détruit
            int compte = 0;
            while (m > 0) {
                if (m % 10 == c) {
                    compte = compte + 1;
                }
                m = m / 10;
            }
            if (compte > meilleur_compte) {
                meilleur = c;
                meilleur_compte = compte;
            }
        }
        cout << meilleur << " " << meilleur_compte << "\n";
    }
    return 0;
}
