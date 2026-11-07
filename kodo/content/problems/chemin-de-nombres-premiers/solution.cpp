#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

int main() {
    int a, b, k;
    cin >> a >> b >> k;
    const int LIMITE = 100000;
    vector<int> dist(LIMITE, -1);
    for (int i = 0; i < k; i++) {
        int x;
        cin >> x;
        dist[x] = -2;                       // marqué : on n'y entre jamais
    }
    // crible d'Ératosthène jusqu'à 100 000
    vector<bool> premier(LIMITE, true);
    premier[0] = premier[1] = false;
    for (int i = 2; i < 317; i++) {
        if (premier[i]) {
            for (int j = i * i; j < LIMITE; j += i) premier[j] = false;
        }
    }
    int d = to_string(a).size();
    dist[a] = 0;
    queue<int> file;
    file.push(a);
    while (!file.empty()) {
        int x = file.front();
        file.pop();
        if (x == b) break;
        int puissance = 1;
        for (int p = 0; p < d; p++) {
            int c = x / puissance % 10;
            for (int c2 = 0; c2 < 10; c2++) {
                if (c2 == c || (c2 == 0 && p == d - 1)) continue;
                int y = x + (c2 - c) * puissance;
                if (premier[y] && dist[y] == -1) {
                    dist[y] = dist[x] + 1;
                    file.push(y);
                }
            }
            puissance *= 10;
        }
    }
    cout << dist[b] << "\n";
    return 0;
}
