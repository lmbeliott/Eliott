#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

struct Arete {
    int vers, longueur, speciale;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, kMax;
    cin >> n >> m >> kMax;
    vector<vector<Arete>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b, t, c;
        cin >> a >> b >> t >> c;
        voisins[a].push_back({b, t, c});
        voisins[b].push_back({a, t, c});
    }

    // dist[u][k] = longueur minimale pour être au sommet u après k passages sur une arête spéciale.
    vector<vector<long long>> dist(n + 1, vector<long long>(kMax + 1, INFINI));
    using Etat = tuple<long long, int, int>;  // (longueur, sommet, passages sur une arête spéciale)
    priority_queue<Etat, vector<Etat>, greater<Etat>> tas;
    dist[1][0] = 0;
    tas.push({0, 1, 0});
    while (!tas.empty()) {
        auto [d, u, k] = tas.top();
        tas.pop();
        if (d > dist[u][k]) continue;  // entrée périmée
        if (u == n) {
            cout << d << "\n";  // premier état (N, k) retiré : c'est le plus court
            return 0;
        }
        for (const Arete& a : voisins[u]) {
            int k2 = k + a.speciale;  // une arête spéciale compte pour un passage
            if (k2 <= kMax && d + a.longueur < dist[a.vers][k2]) {
                dist[a.vers][k2] = d + a.longueur;
                tas.push({d + a.longueur, a.vers, k2});
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}
