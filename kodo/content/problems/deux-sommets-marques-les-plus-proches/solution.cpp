#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

struct Arete {
    int a, b;
    long long l;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> marques(k);
    for (int& s : marques) cin >> s;
    vector<vector<pair<int, long long>>> voisins(n + 1);
    vector<Arete> aretes(m);
    for (auto& e : aretes) {
        cin >> e.a >> e.b >> e.l;
        voisins[e.a].push_back({e.b, e.l});
        voisins[e.b].push_back({e.a, e.l});
    }

    // Dijkstra à sources multiples : dist[v] = distance au sommet marqué le plus proche,
    // origine[v] = ce sommet marqué
    vector<long long> dist(n + 1, INFINI);
    vector<int> origine(n + 1, 0);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    for (int s : marques) {
        dist[s] = 0;
        origine[s] = s;
        tas.push({0, s});
    }
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                origine[v] = origine[u];
                tas.push({dist[v], v});
            }
        }
    }

    // une arête dont les extrémités ont des origines différentes donne un chemin entre deux sommets marqués
    long long meilleur = INFINI;
    for (const auto& e : aretes) {
        if (dist[e.a] < INFINI && dist[e.b] < INFINI && origine[e.a] != origine[e.b]) {
            meilleur = min(meilleur, dist[e.a] + e.l + dist[e.b]);
        }
    }
    cout << (meilleur < INFINI ? meilleur : -1) << "\n";
    return 0;
}
