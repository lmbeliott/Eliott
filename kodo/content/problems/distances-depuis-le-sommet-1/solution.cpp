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
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long l;
        cin >> a >> b >> l;
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }

    // Dijkstra depuis le sommet 1, avec suppression paresseuse
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;  // entrée périmée
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }

    for (int v = 1; v <= n; v++) {
        cout << (dist[v] < INFINI ? dist[v] : -1) << (v == n ? "\n" : " ");
    }
    return 0;
}
