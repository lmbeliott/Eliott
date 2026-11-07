#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int k = 0; k < m; k++) {
        int l, r;
        cin >> l >> r;
        int i = l - 1;       // positions à partir de 1, indices à partir de 0
        int j = r - 1;
        while (i < j) {
            swap(t[i], t[j]);
            i = i + 1;
            j = j - 1;
        }
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
