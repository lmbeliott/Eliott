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
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, long long>>> successeurs(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long l;
        cin >> a >> b >> l;
        successeurs[a].push_back({b, l});
    }

    vector<long long> dist(n + 1, INFINI);
    vector<int> pred(n + 1, 0);  // sommet d'où l'on vient sur le meilleur chemin connu
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        if (u == n) break;  // la distance de N est définitive
        for (auto [v, l] : successeurs[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                pred[v] = u;
                tas.push({dist[v], v});
            }
        }
    }

    if (dist[n] == INFINI) {
        cout << -1 << "\n";
        return 0;
    }
    // on remonte les prédécesseurs depuis N, puis on retourne la liste
    vector<int> chemin = {n};
    while (chemin.back() != 1) chemin.push_back(pred[chemin.back()]);
    reverse(chemin.begin(), chemin.end());
    cout << dist[n] << " " << chemin.size() << "\n";
    for (size_t i = 0; i < chemin.size(); i++) cout << chemin[i] << (i + 1 == chemin.size() ? "\n" : " ");
    return 0;
}
