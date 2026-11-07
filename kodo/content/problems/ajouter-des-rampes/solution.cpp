#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;

    // la rampe (L, R) ajoute x - L + 1 = 1 * x + (1 - L) à chaque case x de L à R :
    // on note le début et la fin de chaque pente et de chaque constante
    vector<long long> pente(n + 2, 0), constante(n + 2, 0);
    for (int k = 0; k < q; k++) {
        int l, r;
        cin >> l >> r;
        pente[l] += 1;
        pente[r + 1] -= 1;
        constante[l] += 1 - l;
        constante[r + 1] -= 1 - l;
    }

    long long a = 0;   // somme des pentes des rampes qui couvrent la case x
    long long b = 0;   // somme de leurs constantes
    long long maximum = -1;
    int nombre = 0;
    for (int x = 1; x <= n; x++) {
        a += pente[x];
        b += constante[x];
        long long valeur = a * x + b;
        if (valeur > maximum) {
            maximum = valeur;
            nombre = 1;
        } else if (valeur == maximum) {
            nombre++;
        }
    }
    cout << maximum << " " << nombre << "\n";
    return 0;
}
