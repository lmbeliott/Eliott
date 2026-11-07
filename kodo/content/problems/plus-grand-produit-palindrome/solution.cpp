#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int meilleur = 0;       // le plus grand palindrome trouvé (0 : aucun)
    int nombre = 0;         // nombre de couples qui le donnent
    for (int x = a; x <= b; x++) {
        for (int y = x; y <= b; y++) {
            int p = x * y;
            if (p >= meilleur) {
                // p est-il un palindrome ? On construit son retourné r.
                int m = p;
                int r = 0;
                while (m > 0) {
                    r = r * 10 + m % 10;
                    m = m / 10;
                }
                if (r == p) {
                    if (p > meilleur) {
                        meilleur = p;
                        nombre = 1;     // le couple (x, y) compte déjà
                    } else {
                        nombre = nombre + 1;
                    }
                }
            }
        }
    }
    if (meilleur == 0) {
        cout << "AUCUN" << "\n";
    } else {
        cout << meilleur << " " << nombre << "\n";
    }
    return 0;
}
