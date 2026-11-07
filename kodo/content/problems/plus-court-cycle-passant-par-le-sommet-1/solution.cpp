#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = 1LL << 60;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> a(m), b(m), t(m);
    vector<vector<tuple<int, int, int>>> voisins(n + 1);  // (voisin, longueur, numéro de l'arête)
    for (int i = 0; i < m; i++) {
        cin >> a[i] >> b[i] >> t[i];
        voisins[a[i]].push_back({b[i], t[i], i});
        voisins[b[i]].push_back({a[i], t[i], i});
    }

    // Dijkstra depuis 1. Pour chaque sommet v, on retient l'arête par laquelle on l'atteint
    // (arrivee[v]) et la première arête du chemin depuis 1 (branche[v]).
    vector<long long> dist(n + 1, INFINI);
    vector<int> arrivee(n + 1, -1), branche(n + 1, -1);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;  // entrée périmée
        for (auto [v, w, i] : voisins[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                arrivee[v] = i;
                branche[v] = (u == 1) ? i : branche[u];
                tas.push({dist[v], v});
            }
        }
    }

    long long meilleur = INFINI;
    for (int i = 0; i < m; i++) {
        if (dist[a[i]] == INFINI || dist[b[i]] == INFINI) continue;
        if (a[i] == 1 || b[i] == 1) {
            int v = (a[i] == 1) ? b[i] : a[i];
            // Cette arête, puis le chemin de v vers 1 dans l'arbre, s'il ne la reprend pas.
            if (arrivee[v] != i) meilleur = min(meilleur, t[i] + dist[v]);
        } else if (branche[a[i]] != branche[b[i]]) {
            // Deux branches différentes : les deux chemins ne se touchent qu'en 1.
            meilleur = min(meilleur, dist[a[i]] + t[i] + dist[b[i]]);
        }
    }
    cout << (meilleur < INFINI ? meilleur : -1) << "\n";
    return 0;
}
