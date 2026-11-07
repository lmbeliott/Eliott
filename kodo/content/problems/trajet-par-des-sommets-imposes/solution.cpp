#include <algorithm>
#include <functional>
#include <iostream>
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

int k;
vector<int> imposes;
vector<vector<long long>> dist;
vector<bool> utilise;
long long meilleur = INFINI;

// dernier : indice (dans dist) du dernier point visité ; nb : nombre de sommets imposés déjà visités
void explorer(int dernier, int nb, long long total) {
    if (nb == k) {  // tous visités : il reste à aller en N
        if (dist[dernier][n] < INFINI) meilleur = min(meilleur, total + dist[dernier][n]);
        return;
    }
    for (int i = 1; i <= k; i++) {
        if (!utilise[i] && dist[dernier][imposes[i - 1]] < INFINI) {
            long long nouveau = total + dist[dernier][imposes[i - 1]];
            if (nouveau < meilleur) {  // élagage : inutile de continuer si l'on fait déjà moins bien
                utilise[i] = true;
                explorer(i, nb + 1, nouveau);
                utilise[i] = false;
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int m;
    cin >> n >> m >> k;
    imposes.resize(k);
    for (int& s : imposes) cin >> s;
    voisins.resize(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long l;
        cin >> a >> b >> l;
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }

    // dist[0] : distances depuis le départ ; dist[i] : depuis le i-ème sommet imposé.
    // K + 1 exécutions de Dijkstra en tout.
    dist.push_back(dijkstra(1));
    for (int s : imposes) dist.push_back(dijkstra(s));
    utilise.assign(k + 1, false);
    explorer(0, 0, 0);  // on essaie tous les ordres de visite, par retour sur trace
    cout << (meilleur < INFINI ? meilleur : -1) << "\n";
    return 0;
}
