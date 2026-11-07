#include <algorithm>
#include <iostream>
#include <queue>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    // parcours en largeur depuis la liste triée ; un état est une chaîne comme "2143"
    string triee;
    for (int i = 1; i <= n; i++) triee += char('0' + i);
    unordered_map<string, int> dist;
    dist[triee] = 0;
    queue<string> file;
    file.push(triee);
    while (!file.empty()) {
        string s = file.front();
        file.pop();
        int d = dist[s];
        for (int k = 2; k <= n; k++) {
            string t = s;
            reverse(t.begin(), t.begin() + k);   // retourner les k premiers éléments
            if (!dist.count(t)) {
                dist[t] = d + 1;
                file.push(t);
            }
        }
    }
    for (int i = 0; i < q; i++) {
        string s;
        for (int j = 0; j < n; j++) {
            int x;
            cin >> x;
            s += char('0' + x);
        }
        cout << dist[s] << "\n";
    }
    return 0;
}
