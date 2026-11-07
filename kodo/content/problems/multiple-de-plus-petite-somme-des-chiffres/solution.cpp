#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int k, b;
    cin >> k >> b;
    // sommets : les restes modulo K. Depuis le reste r :
    //   « ajouter 1 »          mène à (r + 1) mod K, coût 1 ;
    //   « multiplier par B »   mène à (r × B) mod K, coût 0.
    const int INFINI = 1000000000;
    vector<int> dist(k, INFINI);
    int depart = 1 % k;  // on part du nombre 1
    dist[depart] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> tas;
    tas.push({0, depart});
    while (!tas.empty()) {
        auto [d, r] = tas.top();
        tas.pop();
        if (d > dist[r]) continue;
        if (r == 0) break;
        int voisins[2] = {(r + 1) % k, (int)((long long)r * b % k)};
        int couts[2] = {1, 0};
        for (int i = 0; i < 2; i++) {
            int v = voisins[i];
            if (d + couts[i] < dist[v]) {
                dist[v] = d + couts[i];
                tas.push({dist[v], v});
            }
        }
    }
    cout << dist[0] + 1 << "\n";  // + 1 pour le chiffre 1 de départ
    return 0;
}
