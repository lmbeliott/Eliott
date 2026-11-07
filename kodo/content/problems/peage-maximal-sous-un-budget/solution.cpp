#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int n, m;
long long budget;
vector<int> ra, rb;
vector<long long> rl, rt;

// Dijkstra en n'utilisant que les routes de péage au plus seuil
bool possible(long long seuil) {
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        if (rt[i] <= seuil) {
            voisins[ra[i]].push_back({rb[i], rl[i]});
            voisins[rb[i]].push_back({ra[i], rl[i]});
        }
    }
    vector<long long> dist(n + 1, budget + 1);  // au-delà du budget, inutile de continuer
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        if (u == n) return true;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m >> budget;
    ra.resize(m);
    rb.resize(m);
    rl.resize(m);
    rt.resize(m);
    for (int i = 0; i < m; i++) cin >> ra[i] >> rb[i] >> rl[i] >> rt[i];
    if (n == 1) {
        cout << 0 << "\n";
        return 0;
    }
    vector<long long> peages(rt);
    sort(peages.begin(), peages.end());
    peages.erase(unique(peages.begin(), peages.end()), peages.end());
    if (peages.empty() || !possible(peages.back())) {
        cout << -1 << "\n";
        return 0;
    }
    int bas = 0, haut = peages.size() - 1;  // possible(peages[haut]) est vrai
    while (bas < haut) {
        int milieu = (bas + haut) / 2;
        if (possible(peages[milieu])) haut = milieu;
        else bas = milieu + 1;
    }
    cout << peages[bas] << "\n";
    return 0;
}
