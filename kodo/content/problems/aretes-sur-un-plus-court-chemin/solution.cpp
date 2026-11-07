#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = 1LL << 60;

// dist[v] = longueur d'un plus court chemin de depart à v.
vector<long long> dijkstra(int n, const vector<vector<pair<int, int>>>& voisins, int depart) {
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> tas;
    dist[depart] = 0;
    tas.push({0, depart});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;  // entrée périmée
        for (auto [v, t] : voisins[u]) {
            if (d + t < dist[v]) {
                dist[v] = d + t;
                tas.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> a(m), b(m), t(m);
    vector<vector<pair<int, int>>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        cin >> a[i] >> b[i] >> t[i];
        voisins[a[i]].push_back({b[i], t[i]});
        voisins[b[i]].push_back({a[i], t[i]});
    }
    vector<long long> depuis1 = dijkstra(n, voisins, 1);
    vector<long long> depuisN = dijkstra(n, voisins, n);
    long long total = depuis1[n];

    int compte = 0;
    if (total < INFINI) {
        for (int i = 0; i < m; i++) {
            // L'arête peut être parcourue dans les deux sens.
            if (depuis1[a[i]] + t[i] + depuisN[b[i]] == total || depuis1[b[i]] + t[i] + depuisN[a[i]] == total)
                compte++;
        }
    }
    cout << compte << "\n";
    return 0;
}
