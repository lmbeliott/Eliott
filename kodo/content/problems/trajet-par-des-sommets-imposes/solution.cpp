#include <algorithm>
#include <functional>
#include <iostream>
#include <numeric>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = (long long)1e18;
int n;
vector<vector<pair<int, long long>>> voisins;

vector<long long> dijkstra(int source) {
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[source] = 0;
    tas.push({0, source});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int m, k;
    cin >> n >> m >> k;
    vector<int> imposes(k);
    for (int& s : imposes) cin >> s;
    voisins.resize(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long l;
        cin >> a >> b >> l;
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }

    // distances depuis le départ et depuis chaque sommet imposé : K + 1 exécutions de Dijkstra
    vector<long long> depuisDepart = dijkstra(1);
    vector<vector<long long>> depuis;
    for (int s : imposes) depuis.push_back(dijkstra(s));

    long long meilleur = INFINI;
    vector<int> ordre(k);
    iota(ordre.begin(), ordre.end(), 0);
    do {  // on essaie tous les ordres de visite
        long long total = (k > 0) ? depuisDepart[imposes[ordre[0]]] : depuisDepart[n];
        for (int i = 0; i + 1 < k; i++) total += depuis[ordre[i]][imposes[ordre[i + 1]]];
        if (k > 0) total += depuis[ordre[k - 1]][n];
        meilleur = min(meilleur, total);
    } while (next_permutation(ordre.begin(), ordre.end()));
    cout << (meilleur < INFINI ? meilleur : -1) << "\n";
    return 0;
}
