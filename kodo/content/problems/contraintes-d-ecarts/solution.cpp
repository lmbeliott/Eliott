#include <iostream>
#include <vector>
using namespace std;

const long long INFINI = (long long)4e18;

struct Arc {
    int a, b;
    long long c;  // x[b] - x[a] <= c : arc de a vers b, de longueur c
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<Arc> arcs(m);
    for (auto& e : arcs) cin >> e.a >> e.b >> e.c;

    // 1. Y a-t-il une solution ? Bellman-Ford depuis une source fictive reliée à tous les sommets
    vector<long long> pot(n + 1, 0);
    bool change = false;
    for (int tour = 0; tour < n; tour++) {
        change = false;
        for (const auto& e : arcs) {
            if (pot[e.a] + e.c < pot[e.b]) {
                pot[e.b] = pot[e.a] + e.c;
                change = true;
            }
        }
        if (!change) break;
    }
    if (change) {  // encore une amélioration au N-ième tour : cycle de longueur négative
        cout << "IMPOSSIBLE\n";
        return 0;
    }

    // 2. Plus grande valeur de x[N] - x[1] : distance de 1 à N
    vector<long long> dist(n + 1, INFINI);
    dist[1] = 0;
    for (int tour = 0; tour < n - 1; tour++) {
        change = false;
        for (const auto& e : arcs) {
            if (dist[e.a] < INFINI && dist[e.a] + e.c < dist[e.b]) {
                dist[e.b] = dist[e.a] + e.c;
                change = true;
            }
        }
        if (!change) break;
    }
    if (dist[n] == INFINI) cout << "INFINI\n";
    else cout << dist[n] << "\n";
    return 0;
}
