#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// parcours en largeur depuis le sommet 1 ; renvoie le tableau des sommets marqués
vector<bool> accessibles(const vector<vector<int>> &voisins, int n) {
    vector<bool> vu(n + 1, false);
    vu[1] = true;
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int u = file.front();
        file.pop();
        for (int v : voisins[u]) {
            if (!vu[v]) {
                vu[v] = true;
                file.push(v);
            }
        }
    }
    return vu;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<int>> avant(n + 1), arriere(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        avant[a].push_back(b);     // arc dans son sens
        arriere[b].push_back(a);   // arc retourné
    }
    vector<bool> depuis1 = accessibles(avant, n);
    vector<bool> vers1 = accessibles(arriere, n);
    int x = 0, y = 0, z = 0;
    for (int v = 1; v <= n; v++) {
        if (depuis1[v]) x++;
        if (vers1[v]) y++;
        if (depuis1[v] && vers1[v]) z++;
    }
    cout << x << " " << y << " " << z << "\n";
    return 0;
}
