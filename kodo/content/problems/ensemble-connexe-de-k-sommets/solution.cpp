#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

const long long MOINS_INFINI = -(1LL << 60);

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<long long> w(n + 1);
    for (int v = 1; v <= n; v++) cin >> w[v];
    vector<int> parent(n + 1, 0);
    for (int v = 2; v <= n; v++) cin >> parent[v];

    // meilleur[v][j] (1 <= j <= k) : plus grand poids d'un ensemble connexe de j sommets
    // dont v est le sommet le plus haut. Le tableau ne dépasse jamais k + 1 cases.
    vector<vector<long long>> meilleur(n + 1);
    for (int v = 1; v <= n; v++) meilleur[v] = {MOINS_INFINI, w[v]};
    long long reponse = MOINS_INFINI;

    // parent[v] < v : en parcourant v de n à 1, les enfants sont traités avant leur parent
    for (int v = n; v >= 1; v--) {
        vector<long long>& mv = meilleur[v];
        if ((int)mv.size() > k) reponse = max(reponse, mv[k]);
        if (v == 1) break;
        vector<long long>& mp = meilleur[parent[v]];
        // Fusion : on ajoute à l'ensemble du parent (a sommets) un ensemble de b sommets qui descend de v.
        int taille = min(k, (int)mp.size() - 1 + (int)mv.size() - 1);
        vector<long long> nouveau(mp);
        nouveau.resize(taille + 1, MOINS_INFINI);
        for (int a = 1; a < (int)mp.size(); a++) {
            int bMax = min((int)mv.size() - 1, taille - a);
            for (int b = 1; b <= bMax; b++)
                nouveau[a + b] = max(nouveau[a + b], mp[a] + mv[b]);
        }
        mp.swap(nouveau);
        vector<long long>().swap(mv);
    }
    cout << reponse << "\n";
    return 0;
}
