#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

struct Liaison {
    int vers;
    long long premier, periode, duree;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<Liaison>> sortantes(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long f, p, t;
        cin >> a >> b >> f >> p >> t;
        sortantes[a].push_back({b, f, p, t});
    }

    // arrivee[v] = date d'arrivée au plus tôt au sommet v.
    vector<long long> arrivee(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    arrivee[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > arrivee[u]) continue;  // entrée périmée
        if (u == n) {
            cout << d << "\n";
            return 0;
        }
        for (const Liaison& l : sortantes[u]) {
            // Premier départ à une date >= d : premier, premier + periode, ...
            long long depart;
            if (d <= l.premier) depart = l.premier;
            else depart = l.premier + (d - l.premier + l.periode - 1) / l.periode * l.periode;
            if (depart + l.duree < arrivee[l.vers]) {
                arrivee[l.vers] = depart + l.duree;
                tas.push({arrivee[l.vers], l.vers});
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}
