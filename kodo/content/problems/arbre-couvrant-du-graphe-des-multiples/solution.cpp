#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n;
    cin >> n;
    // Le poids minimal vaut la somme des plus petits facteurs premiers de 2, 3, ..., N.
    // marque[r] = 1 quand le plus petit facteur premier de r est déjà compté.
    vector<char> marque(n + 1, 0);
    long long total = 0;
    for (long long p = 2; p <= n; p++) {
        if (marque[p]) continue;
        // p n'a pas de facteur plus petit : il est premier, et c'est le plus petit facteur
        // de chacun de ses multiples pas encore marqués
        for (long long r = p; r <= n; r += p) {
            if (!marque[r]) {
                marque[r] = 1;
                total += p;
            }
        }
    }
    cout << total << "\n";
    return 0;
}
