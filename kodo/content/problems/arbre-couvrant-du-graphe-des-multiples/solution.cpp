#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    // ppf[r] = plus petit facteur premier de r (0 tant qu'aucun facteur n'est trouvé)
    vector<int> ppf(n + 1, 0);
    for (long long p = 2; p * p <= n; p++) {
        if (ppf[p] != 0) continue;  // p a un facteur plus petit : il n'est pas premier
        for (long long r = p * p; r <= n; r += p)
            if (ppf[r] == 0) ppf[r] = p;
    }

    // Le poids minimal vaut la somme des plus petits facteurs premiers de 2, 3, ..., N.
    // Un r resté sans facteur est premier : c'est son propre plus petit facteur.
    long long total = 0;
    for (int r = 2; r <= n; r++) total += (ppf[r] == 0 ? r : ppf[r]);
    cout << total << "\n";
    return 0;
}
