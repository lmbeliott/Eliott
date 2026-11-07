#include <iostream>
#include <vector>
using namespace std;

// Renverse t[i..j] en place : grâce au &, le tableau de l'appelant est modifié.
void retourner(vector<int> &t, int i, int j) {
    while (i < j) {
        int x = t[i];
        t[i] = t[j];
        t[j] = x;
        i = i + 1;
        j = j - 1;
    }
}

// Trois retournements : les k premiers, les n - k derniers, puis tout.
void tourner(vector<int> &t, int k) {
    int n = t.size();
    retourner(t, 0, k - 1);
    retourner(t, k, n - 1);
    retourner(t, 0, n - 1);
}

int main() {
    int n, q;
    cin >> n >> q;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < q; i++) {
        char c;
        cin >> c;
        if (c == 'R') {
            int l, d;
            cin >> l >> d;
            retourner(t, l - 1, d - 1);
        } else {
            int k;
            cin >> k;
            tourner(t, k);
        }
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << t[i];
    }
    cout << "\n";
    return 0;
}
