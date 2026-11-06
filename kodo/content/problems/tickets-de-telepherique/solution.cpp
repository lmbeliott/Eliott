#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

struct Liaison {
    int vers, duree, telepherique;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, kMax;
    cin >> n >> m >> kMax;
    vector<vector<Liaison>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, t, c;
        cin >> a >> b >> t >> c;
        voisins[a].push_back({b, t, c});
        voisins[b].push_back({a, t, c});
    }

    // dist[u][k] = durée minimale pour être à la gare u après avoir utilisé k tickets.
    vector<vector<long long>> dist(n + 1, vector<long long>(kMax + 1, INFINI));
    using Etat = tuple<long long, int, int>;  // (durée, gare, tickets utilisés)
    priority_queue<Etat, vector<Etat>, greater<Etat>> tas;
    dist[1][0] = 0;
    tas.push({0, 1, 0});
    while (!tas.empty()) {
        auto [d, u, k] = tas.top();
        tas.pop();
        if (d > dist[u][k]) continue;  // entrée périmée
        if (u == n) {
            cout << d << "\n";  // premier état (N, k) retiré : c'est le plus rapide
            return 0;
        }
        for (const Liaison& l : voisins[u]) {
            int k2 = k + l.telepherique;  // un téléphérique consomme un ticket
            if (k2 <= kMax && d + l.duree < dist[l.vers][k2]) {
                dist[l.vers][k2] = d + l.duree;
                tas.push({d + l.duree, l.vers, k2});
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}
