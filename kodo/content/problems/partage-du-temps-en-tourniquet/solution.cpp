#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long q;
    cin >> n >> q;
    vector<long long> reste(n);    // temps restant de chaque tâche
    queue<int> file;               // numéros (à partir de 0) des tâches en attente
    for (int i = 0; i < n; i++) {
        cin >> reste[i];
        file.push(i);
    }
    vector<long long> fin(n, 0);
    long long t = 0;
    while (!file.empty()) {
        int i = file.front();
        file.pop();
        long long d = min(q, reste[i]);
        t += d;
        reste[i] -= d;
        if (reste[i] == 0) {
            fin[i] = t;
        } else {
            file.push(i);          // retour en fin de file
        }
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << fin[i];
    }
    cout << "\n";
    return 0;
}
