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
    int n, m;
    cin >> n >> m;
    vector<long long> pause(n + 1, 0);
    for (int i = 1; i <= n; i++) cin >> pause[i];
    pause[n] = 0;  // pas de pause au refuge d'arrivée

    vector<vector<pair<int, int>>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, t;
        cin >> a >> b >> t;
        voisins[a].push_back({b, t});
        voisins[b].push_back({a, t});
    }

    // Dijkstra : entrer dans v par un sentier de durée t coûte t + pause[v].
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;  // entrée périmée
        if (u == n) break;          // la distance de N est définitive
        for (auto [v, t] : voisins[u]) {
            long long nd = d + t + pause[v];
            if (nd < dist[v]) {
                dist[v] = nd;
                tas.push({nd, v});
            }
        }
    }

    cout << (dist[n] < INFINI ? dist[n] : -1) << "\n";
    return 0;
}
