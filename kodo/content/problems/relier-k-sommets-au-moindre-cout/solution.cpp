#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

const long long INF = 1LL << 60;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> imposes(k);
    for (int& t : imposes) {
        cin >> t;
        t--;
    }
    vector<vector<pair<int, long long>>> voisins(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        long long c;
        cin >> u >> v >> c;
        u--;
        v--;
        voisins[u].push_back({v, c});
        voisins[v].push_back({u, c});
    }

    // cout_[masque][v] : coût minimal d'un ensemble d'arêtes qui relie v
    // et tous les sommets imposés du masque
    int tout = (1 << k) - 1;
    vector<vector<long long>> cout_(tout + 1);
    for (int masque = 1; masque <= tout; masque++) {
        vector<long long> actuel(n, INF);
        if ((masque & (masque - 1)) == 0) {
            // un seul sommet imposé
            actuel[imposes[__builtin_ctz(masque)]] = 0;
        } else {
            // Deux arbres qui se rejoignent en v : on coupe le masque en deux parties non vides.
            // La partie s contient le plus petit bit du masque, pour ne voir chaque coupe qu'une fois.
            int bas = masque & -masque;
            for (int s = (masque - 1) & masque; s > 0; s = (s - 1) & masque) {
                if (!(s & bas)) continue;
                const vector<long long>& a = cout_[s];
                const vector<long long>& b = cout_[masque ^ s];
                for (int v = 0; v < n; v++) actuel[v] = min(actuel[v], a[v] + b[v]);
            }
        }
        // Puis on prolonge depuis v par un chemin : Dijkstra qui part de tous les sommets à la fois.
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
        for (int v = 0; v < n; v++)
            if (actuel[v] < INF) tas.push({actuel[v], v});
        while (!tas.empty()) {
            auto [d, u] = tas.top();
            tas.pop();
            if (d > actuel[u]) continue;
            for (auto [v, c] : voisins[u]) {
                if (d + c < actuel[v]) {
                    actuel[v] = d + c;
                    tas.push({d + c, v});
                }
            }
        }
        cout_[masque] = actuel;
    }
    cout << cout_[tout][imposes[0]] << "\n";
    return 0;
}
