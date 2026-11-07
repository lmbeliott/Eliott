#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long c;
    cin >> n >> c;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    // crible : plus petit facteur premier de chaque entier jusqu'au maximum
    int vmax = *max_element(a.begin(), a.end());
    vector<int> ppf(vmax + 1);
    for (int i = 0; i <= vmax; i++) ppf[i] = i;
    for (int i = 2; (long long)i * i <= vmax; i++)
        if (ppf[i] == i)
            for (int j = i * i; j <= vmax; j += i)
                if (ppf[j] == j) ppf[j] = i;

    // sommets 0..N-1 : les cases ; sommet N + p : le « carrefour » du nombre premier p
    vector<vector<pair<int, long long>>> voisins(n + vmax + 1);
    for (int i = 0; i < n; i++) {
        if (i + 1 < n) {
            voisins[i].push_back({i + 1, c});
            voisins[i + 1].push_back({i, c});
        }
        int x = a[i];
        while (x > 1) {
            int p = ppf[x];
            voisins[i].push_back({n + p, p});  // entrer dans le carrefour de p coûte p
            voisins[n + p].push_back({i, 0});  // en sortir vers une case multiple de p est gratuit
            while (x % p == 0) x /= p;
        }
    }

    vector<long long> dist(n + vmax + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[0] = 0;
    tas.push({0, 0});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        if (u == n - 1) break;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }
    cout << dist[n - 1] << "\n";
    return 0;
}
