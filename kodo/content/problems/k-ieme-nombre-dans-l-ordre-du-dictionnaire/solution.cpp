#include <algorithm>
#include <iostream>
using namespace std;

// nombre d'entiers de 1 à n dont l'écriture commence par celle de p
long long compter(long long p, long long n) {
    long long total = 0;
    long long debut = p, fin = p;
    while (debut <= n) {
        total += min(n, fin) - debut + 1;
        if (debut > n / 10) break;           // 10 * debut dépasserait n
        debut = debut * 10;
        fin = (fin > n / 10) ? n : fin * 10 + 9;
    }
    return total;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n, k;
        cin >> n >> k;
        long long p = 1;
        k = k - 1;                 // le nombre 1 est le premier de la liste
        while (k > 0) {
            long long taille = compter(p, n);
            if (taille <= k) {
                k -= taille;       // on saute tout le bloc de p
                p = p + 1;
            } else {
                k -= 1;            // on descend vers 10p, qui suit p
                p = p * 10;
            }
        }
        cout << p << "\n";
    }
    return 0;
}
