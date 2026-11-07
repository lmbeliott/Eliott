#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<long long> couvre(n, 0);
    for (int i = 0; i < n; i++) {
        int l;
        cin >> l;
        for (int j = 0; j < l; j++) {
            int q;
            cin >> q;
            couvre[i] |= 1LL << (q - 1);
        }
    }
    long long tout = (1LL << m) - 1;
    vector<long long> uni(1 << n, 0);
    vector<int> taille(1 << n, 0);
    for (int masque = 1; masque < (1 << n); masque++) {
        int bas = masque & -masque;               // bit le plus bas
        int i = __builtin_ctz(masque);
        uni[masque] = uni[masque - bas] | couvre[i];
        taille[masque] = taille[masque - bas] + 1;
    }
    int k = n + 1;
    for (int masque = 0; masque < (1 << n); masque++)
        if (uni[masque] == tout && taille[masque] < k) k = taille[masque];
    if (k == n + 1) {
        cout << -1 << "\n";
    } else {
        long long nb = 0;
        for (int masque = 0; masque < (1 << n); masque++)
            if (uni[masque] == tout && taille[masque] == k) nb++;
        cout << k << " " << nb << "\n";
    }
    return 0;
}
