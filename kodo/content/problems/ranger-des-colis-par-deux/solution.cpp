#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, c;
    cin >> n >> c;
    vector<int> poids(n);
    for (int i = 0; i < n; i++) cin >> poids[i];
    sort(poids.begin(), poids.end());

    int leger = 0;      // le plus léger des colis restants
    int lourd = n - 1;  // le plus lourd des colis restants
    int caisses = 0;
    while (leger <= lourd) {
        // le plus lourd va dans la prochaine caisse,
        // avec le plus léger si ça ne dépasse pas la charge maximale
        if (leger < lourd && poids[leger] + poids[lourd] <= c) leger++;
        lourd--;
        caisses++;
    }
    cout << caisses << "\n";
    return 0;
}
