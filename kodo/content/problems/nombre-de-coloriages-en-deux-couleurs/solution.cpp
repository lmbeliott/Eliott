#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const long long MOD = 1000000007;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<int> couleur(n + 1, -1);
    long long reponse = 1;
    for (int depart = 1; depart <= n; depart++) {
        if (couleur[depart] != -1) continue;
        reponse = reponse * 2 % MOD;    // nouvelle composante : deux choix
        couleur[depart] = 0;
        queue<int> file;
        file.push(depart);
        while (!file.empty()) {
            int u = file.front();
            file.pop();
            for (int v : voisins[u]) {
                if (couleur[v] == -1) {
                    couleur[v] = 1 - couleur[u];
                    file.push(v);
                } else if (couleur[v] == couleur[u]) {
                    reponse = 0;        // cycle impair (ou boucle)
                }
            }
        }
    }
    cout << reponse << "\n";
    return 0;
}
