#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string lettres;
    cin >> n >> lettres;
    vector<long long> v(n);
    for (auto& x : v) cin >> x;

    // f[l][r] = meilleur total en n'utilisant que les points l..r (0 si l > r)
    vector<vector<long long>> f(n + 2, vector<long long>(n, 0));
    for (int l = n - 1; l >= 0; l--) {
        for (int r = l; r < n; r++) {
            // Cas 1 : le point l n'est relié à rien
            long long res = f[l + 1][r];
            // Cas 2 : l est relié à k ; l'intérieur l+1..k-1 et l'extérieur k+1..r sont indépendants
            for (int k = l + 1; k <= r; k++) {
                if (lettres[k] != lettres[l]) continue;
                long long dedans = (k - 1 >= l + 1) ? f[l + 1][k - 1] : 0;
                long long dehors = (k + 1 <= r) ? f[k + 1][r] : 0;
                res = max(res, v[l] * v[k] + dedans + dehors);
            }
            f[l][r] = res;
        }
    }
    cout << f[0][n - 1] << "\n";
    return 0;
}
